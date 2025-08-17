import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
} from '@mui/material';
import FormDialog from '@components/dialog/form-dialog';
import SelectField from '@components/form/select-field';
import DateField2 from '@components/form/date-field-2';
import { contractSchema } from '@validations/hr-schema';
import { joiResolver } from '@hookform/resolvers/joi';
import toast from '@hooks/toast';
import { CONTRACT_STATUSES_MAP, CONTRACT_TYPES_MAP } from '@configs/const.config';
import ContractService from '@services/hr-module-service/contract.service';
import _ from "lodash";

function UpdateContractDialog({ contract, refetch }) {
    const { t } = useTranslation();
    const dialog = useDialog();

    const form = useForm({
        resolver: joiResolver(contractSchema),
        defaultValues: _.pick(contract, [
            "employeeId",
            "startDate",
            "endDate",
            "type",
            "salary",
            "status",
            "companyId"
        ])
    });

    const {
        register,
        control,
        formState: { errors },
    } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await ContractService.updateContract(contract.id, data);
            if (err) throw new Error(err.code);
            return res;
        },
        onSuccess: (res) => {
            refetch();
            dialog.close();
            toast.success(res.code);
        },
    });

    return (
        <FormDialog
            title="working.hr.contract.update-contract"
            submitButtonText="common.update"
            form={form}
            mutation={mutation}
            dialog={dialog}
            triggerButton={<Button
                variant="text"
                color="primary"
                onClick={dialog.open}
            >
                {t("common.edit")}
            </Button>}
        >
            <DateField2
                name="startDate"
                control={control}
                label={t("model.hr.contract.start-date")}
                error={!!errors.startDate}
                helperText={errors?.startDate?.message}
            />
            <DateField2
                name="endDate"
                control={control}
                label={t("model.hr.contract.end-date")}
                error={!!errors.endDate}
                helperText={errors?.endDate?.message}
            />
            <TextField
                fullWidth
                label={t("model.hr.contract.salary")}
                name="salary"
                type="number"
                error={!!errors.salary}
                helperText={errors?.salary?.message}
                required
                {...register("salary")}
            />
            <SelectField
                name="type"
                control={control}
                label={t("model.hr.contract.type")}
                options={Object.keys(CONTRACT_TYPES_MAP).map((type) => {
                    const { code, label } = CONTRACT_TYPES_MAP[type];
                    return {
                        value: code,
                        label: label,
                    }
                })}
            />
            <SelectField
                name="status"
                control={control}
                label={t("model.hr.contract.status")}
                options={Object.keys(CONTRACT_STATUSES_MAP).map((status) => {
                    const { code, label } = CONTRACT_STATUSES_MAP[status];
                    return {
                        value: code,
                        label: label,
                    }
                })}
            />
        </ FormDialog>
    );
}

export default UpdateContractDialog;