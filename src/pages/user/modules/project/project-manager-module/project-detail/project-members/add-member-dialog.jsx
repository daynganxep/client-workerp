import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import FormDialog from '@components/dialog/form-dialog';
import SelectField from '@components/form/select-field';
import { joiResolver } from '@hookform/resolvers/joi';
import toast from '@hooks/toast';
import ProjectService from '@services/project-module-service/project.service';
import { MANAGER_ADD_MEMBER_DEFAULT_VALUES } from '@configs/default-values/project-default-values';
import { projectMemberSchema } from '@validations/project-schema';
import { useSelector } from 'react-redux';
import { PROJECT_MEMBER_ROLE } from '@configs/const.config';

function AddMemberDialog({ projectId, refetch }) {
    const { t } = useTranslation();
    const dialog = useDialog();
    const employees = useSelector(state => state.company.employees);

    const form = useForm({
        resolver: joiResolver(projectMemberSchema),
        defaultValues: MANAGER_ADD_MEMBER_DEFAULT_VALUES
    });

    const { control } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await ProjectService.addMember(projectId, data);
            if (err) throw new Error(err.code);
            return res;
        },
        onSuccess: (res) => {
            console.log({ res })
            refetch();
            dialog.close();
            toast.success(res.code);
        },
    });

    return (
        <FormDialog
            title="working.project.detail.member.add-member-title"
            submitButtonText="common.create"
            form={form}
            mutation={mutation}
            dialog={dialog}
            triggerButton={<Button
                variant="contained"
                color="primary"
                onClick={dialog.open}
                startIcon={<Add />}
                disabled={!projectId}
            >
                {t("working.project.detail.member.add-member")}
            </Button>}
        >
            <SelectField
                name="employeeId"
                control={control}
                label={t("model.project.project.member")}
                options={employees.map((employee) => ({
                    value: employee.id,
                    label: employee.name,
                }))}
            />
            <SelectField
                name="role"
                control={control}
                label={t("model.project.project.role")}
                options={Object.keys(PROJECT_MEMBER_ROLE).map((status) => {
                    const { code, label } = PROJECT_MEMBER_ROLE[status];
                    return {
                        value: code,
                        label: label,
                    }
                })}
            />
        </ FormDialog>
    );
}

export default AddMemberDialog;